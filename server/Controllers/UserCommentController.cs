// server/Controllers/UserCommentController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Entities;
using System.Security.Claims;
using System.ComponentModel.DataAnnotations; // ✅ Bu satırı ekleyin

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserCommentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserCommentController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("User not authenticated");
            
            return int.Parse(userIdClaim);
        }

        // ✅ Doğru endpoint
        [HttpGet("station/{stationId}")]
        public async Task<IActionResult> GetStationComments(int stationId)
        {
            try
            {
                var comments = await _context.UserComments
                    .Include(c => c.User)
                    .Where(c => c.ChargingStationId == stationId)
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new
                    {
                        Id = c.Id,
                        UserId = c.UserId,
                        ChargingStationId = c.ChargingStationId,
                        Comment = c.Comment,
                        CreatedAt = c.CreatedAt,
                        User = new
                        {
                            Id = c.User.Id,
                            Name = c.User.FullName
                        }
                    })
                    .ToListAsync();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching comments", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();

                var comment = new UserComment
                {
                    UserId = userId,
                    ChargingStationId = dto.ChargingStationId,
                    Comment = dto.Comment,
                    CreatedAt = DateTime.UtcNow
                };

                _context.UserComments.Add(comment);
                await _context.SaveChangesAsync();

                var user = await _context.Users.FindAsync(userId);
                
                // ✅ Null check ekleyin
                if (user == null)
                    return StatusCode(500, new { message = "User not found" });
                
                return Ok(new
                {
                    Id = comment.Id,
                    UserId = comment.UserId,
                    ChargingStationId = comment.ChargingStationId,
                    Comment = comment.Comment,
                    CreatedAt = comment.CreatedAt,
                    User = new
                    {
                        Id = user.Id,
                        Name = user.FullName ?? "Unknown User"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating comment", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                var userId = GetCurrentUserId();

                var comment = await _context.UserComments
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

                if (comment == null)
                    return NotFound(new { message = "Comment not found or you don't have permission to delete it" });

                _context.UserComments.Remove(comment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Comment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting comment", error = ex.Message });
            }
        }
    }

    public class CreateCommentDto
    {
        [Required]
        public int ChargingStationId { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string Comment { get; set; } = string.Empty;
    }
}