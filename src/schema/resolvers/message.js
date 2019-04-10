import { Message, Need, User } from '../../models'

export default {
  Message: {
    associatedNeed: parent => Need.findById(parent.associatedNeed),
    sender: parent => User.findById(parent.sender),
    recipient: parent => User.findById(parent.recipient),
  },
  Query: {
    messages: (_, { all }, { req }) => {
      const { userId } = req.session

      if (all) {
        // Return all messages (read or unread) belonging to current user.
        return Message.find({ recipient: userId })
      }

      // Return unread messages sent to current user.
      return Message.find({ recipient: userId, read: false })
    },
    message: (_, { id }) => Message.find({ recipient: userId }),
  },
  Mutation: {
    createMessage: async (parent, args, { req }) => {
      const { userId } = req.session

      const newMessage = await Message.create({ ...args, sender: userId })

      return newMessage
    },
    markMessageRead: async (_, { messageId }, { req }) => {
      const { userId } = req.session
      const message = await Message.findOne({
        _id: messageId,
        recipient: userId,
      }).exec()

      if (!message) {
        throw new Error('Message not found')
      }

      message.set({ read: true })

      const updatedMessage = await message.save()

      return updatedMessage
    },
    deleteMessage: async (_, { id }, { req }) => {
      const { userId } = req.session
      const removedMessage = await Message.findOneAndRemove({
        id,
        recipient: userId,
      }).exec()

      if (!removedMessage) {
        throw new Error('Message not found')
      }

      return true
    },
  },
}
