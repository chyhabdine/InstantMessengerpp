const attachmentsController = require("../controllers/attachments.controller");

function registerAttachmentRoutes(router, ctx) {
    router.add("GET", "/api/messages/:id/attachments", attachmentsController.listAttachments(ctx));
    router.add("POST", "/api/messages/:id/attachments", attachmentsController.createAttachment(ctx));
    router.add("PUT", "/api/attachments/:id", attachmentsController.updateAttachment(ctx));
    router.add("DELETE", "/api/attachments/:id", attachmentsController.deleteAttachment(ctx));
}

module.exports = registerAttachmentRoutes;
