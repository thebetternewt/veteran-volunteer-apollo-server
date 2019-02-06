import { RecipientProfile } from '../../models'

export default {
  RecipientProfile: {},
  Query: {
    recipientProfile: async () => {},
    recipientProfiles: async () => {},
  },
  Mutation: {
    createRecipientProfile: async (parent, args, { user }) => {
      // TODO: Check if profile already exists for user

      const profile = new RecipientProfile({
        user: user.id,
        ...args,
      })

      await profile.save()

      return profile
    },
  },
}
