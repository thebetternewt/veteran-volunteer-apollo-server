import { LawncareService } from '../../models'

export default {
  LawncareService: {},
  Query: {
    lawncareService: async () => lawncareService.findOne({}),
    lawncareServices: async () => lawncareService.find({}),
  },
  Mutation: {
    createLawncareService: async (parent, args, { user }) => {
      const { equipmentNeeded, description, serviceId } = args

      try {
        const lawncareService = await LawncareService.create({
          equipmentNeeded,
          description,
          service: serviceId,
        })

        return lawncareService
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}
