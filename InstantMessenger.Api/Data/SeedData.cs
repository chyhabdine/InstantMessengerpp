using InstantMessenger.Api.Models;
using InstantMessenger.Api.Models.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace InstantMessenger.Api.Data;

public static class SeedData
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await context.Database.MigrateAsync();

        if (!await context.Roles.AnyAsync())
        {
            context.Roles.AddRange(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "User" }
            );
        }

        if (!await context.Users.AnyAsync())
        {
            var admin = new User
            {
                Email = "admin@instantmessenger.app",
                UserName = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@12345"),
                RoleId = 1,
                CreatedAt = DateTime.UtcNow,
                Presence = PresenceStatus.Online,
                Profile = new UserProfile
                {
                    DisplayName = "Administrator",
                    AvatarUrl = string.Empty,
                    StatusMessage = "System admin",
                    Presence = PresenceStatus.Online
                }
            };

            context.Users.Add(admin);
        }

        await context.SaveChangesAsync();
    }
}
