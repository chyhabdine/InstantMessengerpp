using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Models;

namespace InstantMessenger.Api.Services.Interfaces;

public interface IDeviceService
{
    Task<DeviceDto> RegisterAsync(Guid userId, string name);
    Task UpdateStatusAsync(Guid userId, Guid deviceId, bool isOnline);
    Task<IEnumerable<DeviceDto>> GetDevicesAsync(Guid userId);
    Task<Device?> GetOrCreateAsync(Guid userId, string name);
}
