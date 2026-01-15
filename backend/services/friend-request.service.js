class FriendRequestService {
    constructor({ friendRequestRepository, userRepository, notificationRepository }) {
        this.friendRequestRepository = friendRequestRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    async list(userId) {
        return this.friendRequestRepository.listForUser(userId);
    }

    async create(userId, receiverId) {
        if (userId === receiverId) {
            throw new Error("You cannot send a request to yourself.");
        }
        const receiver = await this.userRepository.findById(receiverId);
        if (!receiver) return null;

        const existing = await this.friendRequestRepository.findPendingPair(userId, receiverId);
        if (existing) {
            throw new Error("A pending request already exists.");
        }

        const request = await this.friendRequestRepository.create({
            requesterId: userId,
            receiverId,
            status: "Pending"
        });

        await this.notificationRepository.create({
            userId: receiverId,
            type: "FriendRequest",
            payload: JSON.stringify({ requestId: request.id }),
            isRead: false
        });

        return request;
    }

    async update(userId, requestId, status) {
        const request = await this.friendRequestRepository.findById(requestId);
        if (!request) return null;
        if (request.receiverId !== userId && request.requesterId !== userId) {
            throw new Error("FORBIDDEN");
        }
        const updated = await this.friendRequestRepository.update(requestId, { status });

        if (status === "Accepted" || status === "Rejected") {
            await this.notificationRepository.create({
                userId: request.requesterId,
                type: "FriendRequest",
                payload: JSON.stringify({ requestId: request.id, status }),
                isRead: false
            });
        }

        return updated;
    }

    async remove(userId, requestId) {
        const request = await this.friendRequestRepository.findById(requestId);
        if (!request) return null;
        if (request.receiverId !== userId && request.requesterId !== userId) {
            throw new Error("FORBIDDEN");
        }
        return this.friendRequestRepository.remove(requestId);
    }
}

module.exports = FriendRequestService;
