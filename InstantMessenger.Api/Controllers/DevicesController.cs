using System.Security.Claims;
using InstantMessenger.Api.DTOs;
using InstantMessenger.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InstantMessenger.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DevicesController : ControllerBase
{
    private readonly IDeviceService _deviceService;

    public DevicesController(IDeviceService deviceService)
    {
        _deviceService = deviceService;
    }

    [HttpPost]
    public async Task<ActionResult<DeviceDto>> Register(DeviceRegistrationRequest request)
    {
        var userId = GetUserId();
        var device = await _deviceService.RegisterAsync(userId, request.Name);
        return Ok(device);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, DeviceStatusRequest request)
    {
        try
        {
            var userId = GetUserId();
            await _deviceService.UpdateStatusAsync(userId, id, request.IsOnline);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DeviceDto>>> Get()
    {
        var userId = GetUserId();
        var devices = await _deviceService.GetDevicesAsync(userId);
        return Ok(devices);
    }

    private Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
