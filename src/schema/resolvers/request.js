import Joi from 'joi'
import {
  ChildcareService,
  Request,
  Service,
  TravelService,
  User,
} from '../../models'
import { mongoose as db } from '../../server'
import { formatLocationInput } from '../../utils/locations'
import { childcareServiceSchema } from '../../validation/services'

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
    createRequest: async (_, args, { user }) => {
      console.log(args)
      const { service } = args

      const session = await db.startSession()

      console.log('starting transaction...')
      session.startTransaction()

      // Create service
      const [newService] = await Service.create(
        [
          {
            title: service.title,
            date: new Date(service.date),
            serviceType: service.serviceType,
            notes: service.notes,
            recipient: user.id,
            location: formatLocationInput(service.location),
          },
        ],
        { session }
      )

      // Check for serviceType and Details

      if (service.serviceType === 'TRAVEL') {
        const [newServiceDetails] = await TravelService.create(
          [
            {
              ...service.travelServiceDetails,
              fromLocation: formatLocationInput(
                service.travelServiceDetails.fromLocation
              ),
              toLocation: formatLocationInput(
                service.travelServiceDetails.toLocation
              ),
              service: newService,
            },
          ],
          { session }
        )

        // await assert.ok(newServiceDetails)
      } else if (service.serviceType === 'CHILDCARE') {
        const errors = await Joi.validate(
          service.childcareServiceDetails,
          childcareServiceSchema,
          {
            abortEarly: false,
          }
        )

        const [newServiceDetails] = await ChildcareService.create(
          [{ ...service.childcareServiceDetails, service: newService }],
          { session }
        )
      } else {
        // Abort transaction if no service details created.
        session.abortTransaction()
      }

      const request = await Request.create({
        service: newService,
        recipient: user,
      })

      await session.commitTransaction()

      return request
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
