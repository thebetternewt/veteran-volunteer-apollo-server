import { Need, Request, User } from '../../models'

export default {
  Request: {
    need: parent => Need.findById(parent.need),
    recipient: parent => User.findById(parent.recipient),
    volunteer: parent => User.findById(parent.volunteer),
  },
  Query: {
    requests: (parent, { status }, { req }) => {
      const { userId } = req.session
      // TODO: Allow admin users to view requests for any user
      // TODO: Allow volunteers to request to serve recipients
      //? TODO: Query requests for recipients

      const searchParams = { volunteer: userId }

      if (status) {
        searchParams.status = status
      }

      return Request.find(searchParams)
    },
    request: (_, { id }) => Request.findById(id),
  },
  Mutation: {
    createRequest: async (_, args, { req }) => {
      const { userId } = req.session

      const newRequest = await Request.create({ ...args, recipient: userId })

      return newRequest
    },
    updateRequestStatus: async (_, { id, status }, { req }) => {
      const { userId } = req.session
      const request = await Request.findById(id).exec()

      if (!request) {
        throw new Error('Request not found.')
      }

      // Make sure if the recipient initiated the request, then only the volunteer
      // can accept the request. Or, if the volunteer initiated the request,
      // then the recipient must accept the request.
      // TODO: Restrict the kinds of updates (e.g. "CANCELLED") each user role can make.
      if (
        !(
          (request.volunteer.toString() === userId &&
            request.initiator === 'RECIPIENT') ||
          (request.recipient.toString() === userId &&
            request.initiator === 'VOLUNTEER')
        )
      ) {
        // TODO: Better error
        throw new Error('Not allowed.')
      }

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
