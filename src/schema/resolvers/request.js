import { Need, Request, User } from '../../models'

export default {
  Request: {
    need: parent => Need.findById(parent.need),
    recipient: parent => User.findById(parent.recipient),
    volunteer: parent => User.findById(parent.volunteer),
  },
  Query: {
    requests: () => Request.find({}),
    request: (_, { id }) => Request.findById(id),
  },
  Mutation: {
    createRequest: async (_, args, { req }) => {
      console.log(args)
      const { userId } = req.session

      const newRequest = await Request.create({ ...args, recipient: userId })

      console.log('newRequest:', newRequest)

      return newRequest
    },
    updateRequestStatus: async (_, args) => {
      const request = await Request.findById(args.id).exec()

      request.set({ status })

      await request.save()

      return request
    },
    deleteRequest: async (_, { id }) => {
      const removedRequest = await Request.findOneAndRemove({ _id: id }).exec()

      if (!removedRequest) {
        throw new Error('Request not found')
      }

      return true
    },
  },
}
