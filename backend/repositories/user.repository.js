const { Op } = require("sequelize");

class UserRepository {
    constructor(models) {
        this.User = models.User;
        this.UserProfile = models.UserProfile;
    }

    async findByEmail(email) {
        return this.User.findOne({ where: { email } });
    }

    async findByUserName(userName) {
        return this.User.findOne({ where: { userName } });
    }

    async findByEmailInsensitive(email) {
        return this.User.findOne({
            where: {
                email: { [Op.iLike]: email }
            }
        });
    }

    async findByUserNameInsensitive(userName) {
        return this.User.findOne({
            where: {
                userName: { [Op.iLike]: userName }
            }
        });
    }

    async findById(id) {
        return this.User.findByPk(id);
    }

    async search(term) {
        if (!term) {
            return this.User.findAll();
        }
        return this.User.findAll({
            where: {
                [Op.or]: [
                    { email: { [Op.iLike]: `%${term}%` } },
                    { userName: { [Op.iLike]: `%${term}%` } }
                ]
            }
        });
    }

    async create(userData) {
        const user = await this.User.create(userData);
        await this.UserProfile.create({
            userId: user.id,
            displayName: user.displayName,
            statusMessage: user.statusMessage || "",
            presence: user.presence || "Online",
            avatarUrl: user.avatarUrl || ""
        });
        return user;
    }

    async updateProfile(userId, profileData) {
        await this.User.update(profileData, { where: { id: userId } });
        const profile = await this.UserProfile.findOne({ where: { userId } });
        if (profile) {
            await profile.update({
                displayName: profileData.displayName,
                statusMessage: profileData.statusMessage,
                presence: profileData.presence,
                avatarUrl: profileData.avatarUrl
            });
        } else {
            await this.UserProfile.create({
                userId,
                displayName: profileData.displayName,
                statusMessage: profileData.statusMessage,
                presence: profileData.presence,
                avatarUrl: profileData.avatarUrl
            });
        }
        return this.findById(userId);
    }
}

module.exports = UserRepository;
