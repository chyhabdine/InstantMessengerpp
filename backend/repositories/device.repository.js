class DeviceRepository {
    constructor(models) {
        this.Device = models.Device;
    }

    async create(userId, name) {
        return this.Device.create({
            userId,
            name,
            lastSeenAt: new Date()
        });
    }

    async touch(deviceId) {
        return this.Device.update({ lastSeenAt: new Date() }, { where: { id: deviceId } });
    }
}

module.exports = DeviceRepository;
