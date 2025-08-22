# UyumsoftProject
Bu Proje Uyumsoft şirketinde yapmış olduğum staj kapsamında geliştirilmiştir.Elektrikli araç şarj istasyonları yönetimi ve kullanıcı etkileşimi için geliştirilmiş bir web uygulamasıdır. Next.js (frontend) ve ASP.NET Core (backend) teknolojileri kullanılarak hazırlanmıştır. Modern web teknolojileri, API geliştirme, veritabanı yönetimi ve kullanıcı arayüzü tasarımı konularında kendimi göstermek amacıyla tasarlanmıştır.

## Proje Genel Bakış

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** ASP.NET Core 8, Entity Framework Core
- **Veritabanı:** PostgreSQL (EF Core ile, Code-First yaklaşım)
- **Authentication:** JWT tabanlı kimlik doğrulama, role-based giriş sistemi (admin ve kullanıcı rolleri)

## Özellikler

- Kullanıcı, admin ve şarj istasyonu yönetimi
- CRUD işlemleri (kullanıcılar, oturumlar, yorumlar, fatura ve favori istasyonlar)
- Admin paneli üzerinden kullanıcı ve istasyon yönetimi
- Rol tabanlı güvenli erişim ve yetkilendirme
- Tüm kodlar ve mimari tarafımca geliştirilmiş olup modern yazılım geliştirme süreçleri ve best practice’ler uygulanmıştır.

## Proje Yapısı
```
UyumsoftProject/
├── client/         # Next.js frontend
└── server/         # ASP.NET Core backend
```

### client/
- `src/app/` altında sayfalar ve layout’lar Next.js App Router mantığına göre yapılandırılmıştır.
- Her sayfa için `page.tsx` ve gerektiğinde `layout.tsx` dosyaları mevcuttur.
- Ortak stiller ve global ayarlar `globals.css` ve `layout.tsx` dosyalarında tutulur.
- Statik dosyalar (ikonlar, görseller) `public/` klasöründe saklanır.

### server/
- `Controllers/` klasöründe her işlevsel alan için ayrı controller dosyaları (ör. `AdminController.cs`, `AuthController.cs`)
- `Models/Entities/` altında veritabanı tablolarını temsil eden entity sınıfları
- `Models/DTOs/` altında veri transfer objeleri (DTO)
- `Data/` klasöründe Entity Framework tabanlı `ApplicationDbContext` ile veritabanı bağlantısı ve migration yönetimi
- `Migrations/` klasörü, EF migration dosyalarını içerir
- Statik dosyalar ve web kaynakları `wwwroot/` altında tutulur

## Başlangıç Adımları

### Frontend
```bash
cd client
npm install
npm run dev
```
Localde çalıştırma: http://localhost:3000

### Backend
```powershell
cd server
dotnet restore
dotnet run
```
API varsayılan: http://localhost:5000

## Deployment
- Proje localde çalışacak şekilde yapılandırılmıştır
- İsteğe bağlı olarak bulut sunuculara deploy edilebilir

## Ekran Görüntüleri
- Ana Sayfa:<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/037b4772-2ccd-41b9-854c-5aeab9bd7f61" />

- Admin Paneli: <img width="1905" height="951" alt="image" src="https://github.com/user-attachments/assets/9371abba-c307-498d-a758-9addbf126195" />

- Kullanıcı Girişi: <img width="1905" height="966" alt="image" src="https://github.com/user-attachments/assets/d1c44feb-32bb-45c1-98c6-7d6943e5f998" />

- Normal Kullanıcı Paneli: <img width="1916" height="1025" alt="image" src="https://github.com/user-attachments/assets/83ee305a-392b-459a-993c-04940b132131" />

- Provider Paneli: <img width="1919" height="858" alt="image" src="https://github.com/user-attachments/assets/c83a2efb-7ef7-444e-9bbc-7ed7f9df950d" />

-User Fonksiyonu: <img width="1913" height="866" alt="image" src="https://github.com/user-attachments/assets/e590d35d-29e4-48a3-b34c-e4b5191ac847" />


## Kişisel Katkı
- Tüm kodlar ve mimari tarafımca geliştirilmiştir
- Modern yazılım geliştirme süreçleri ve best practice’ler uygulanmıştır
- Proje hem teknik hem görsel olarak güçlü ve ölçeklenebilir bir yapı sunmaktadır.
