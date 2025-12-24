using InstantMessenger.Api.Data;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InstantMessenger.Api.Services.Implementations;

public class DeviceService : IDeviceService
{
    private readonly AppDbContext _context;

    public DeviceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DeviceDto> RegisterAsync(Guid userId, string name)
    {
        var device = await _context.Devices.FirstOrDefaultAsync(d => d.UserId == userId && d.Name == name);
        if (device is null)
        {
            device = new Device
            {
                UserId = userId,
                Name = name,
                IsOnline = true,
                LastSeenAt = DateTime.UtcNow
            };
            _context.Devices.Add(device);
        }
        else
        {
            device.IsOnline = true;
            device.LastSeenAt = DateTime.UtcNow;
            _context.Devices.Update(device);
        }

        await _context.SaveChangesAsync();
        return Map(device);
    }

    public async Task UpdateStatusAsync(Guid userId, Guid deviceId, bool isOnline)
    {
        var device = await _context.Devices.FirstOrDefaultAsync(d => d.Id == deviceId && d.UserId == userId);
        if (device is null)
        {
            throw new InvalidOperationException("Device not found.");
        }

        device.IsOnline = isOnline;
        device.LastSeenAt = DateTime.UtcNow;
        _context.Devices.Update(device);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<DeviceDto>> GetDevicesAsync(Guid userId)
    {
        var devices = await _context.Devices.Where(d => d.UserId == userId).AsNoTracking().ToListAsync();
        return devices.Select(Map);
    }

    public async Task<Device?> GetOrCreateAsync(Guid userId, string name)
    {
        var device = await _context.Devices.FirstOrDefaultAsync(d => d.UserId == userId && d.Name == name);
        if (device is null)
        {
            device = new Device
            {
                UserId = userId,
                Name = name,
                IsOnline = true,
                LastSeenAt = DateTime.UtcNow
            };
            _context.Devices.Add(device);
            await _context.SaveChangesAsync();
        }
        else
        {
            device.IsOnline = true;
            device.LastSeenAt = DateTime.UtcNow;
            _context.Devices.Update(device);
            await _context.SaveChangesAsync();
        }

        return device;
    }

    private static DeviceDto Map(Device device) => new()
    {
        Id = device.Id,
        Name = device.Name,
        IsOnline = device.IsOnline,
        LastSeenAt = device.LastSeenAt
    };
}
