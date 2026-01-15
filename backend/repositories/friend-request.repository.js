const { Op } = require("sequelize");

class FriendRequestRepository {
    constructor(models) {
        this.FriendRequest = models.FriendRequest;
    }

    async listForUser(userId) {
        return this.FriendRequest.findAll({
            where: {
                [Op.or]: [{ requesterId: userId }, { receiverId: userId }]
            },
            order: [["createdAt", "DESC"]]
        });
    }

    async findById(id) {
        return this.FriendRequest.findByPk(id);
    }

    async findPendingPair(requesterId, receiverId) {
        return this.FriendRequest.findOne({
            where: {
                requesterId,
                receiverId,
                status: "Pending"
            }
        });
    }

    async create(data) {
        return this.FriendRequest.create(data);
    }

    async update(id, data) {
        await this.FriendRequest.update(data, { where: { id } });
        return this.findById(id);
    }

    async remove(id) {
        const row = await this.findById(id);
        if (!row) return null;
        await row.destroy();
        return row;
    }
}

module.exports = FriendRequestRepository;
