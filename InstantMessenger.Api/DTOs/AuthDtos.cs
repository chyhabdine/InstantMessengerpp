namespace InstantMessenger.Api.DTOs;

public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string DeviceName { get; set; } = "Unknown device";
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string DeviceName { get; set; } = "Unknown device";
}

public class RefreshRequest
{
    public string RefreshToken { get; set; } = string.Empty;
    public string DeviceName { get; set; } = "Unknown device";
}

public class AuthResponse
{
    public Guid UserId { get; set; }
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
}
