namespace InstantMessenger.Api.DTOs;

public class DeviceRegistrationRequest
{
    public string Name { get; set; } = "Unknown device";
}

public class DeviceStatusRequest
{
    public bool IsOnline { get; set; }
}

public class DeviceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsOnline { get; set; }
    public DateTime LastSeenAt { get; set; }
}
