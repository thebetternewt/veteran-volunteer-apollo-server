import { Request, Service, User } from '../../models'

export default {
  Request: {
    service: parent => Service.findById(parent.service),
    volunteer: parent => User.findById(parent.user),
    recipient: parent => User.findById(parent.recipient),
  },
  Query: {
    requests: () => Request.find({}),
    request: (_, { id }) => Request.findById(id),
  },
  Mutation: {
    createRequest: (_, args) => Request.create(args),
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
