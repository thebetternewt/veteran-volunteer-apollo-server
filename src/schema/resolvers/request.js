import Joi from "joi";
import { ChildcareNeed, Request, TravelNeed, User } from "../../models";
import { mongoose as db } from "../../server";
import { formatLocationInput } from "../../utils/locations";
import { childcareNeedSchema } from "../../validation/needs";

export default {
  Request: {
    need: parent => Need.findById(parent.need),
    volunteer: parent => User.findById(parent.user),
    recipient: parent => User.findById(parent.recipient)
  },
  Query: {
    requests: () => Request.find({}),
    request: (_, { id }) => Request.findById(id)
  },
  Mutation: {
    createRequest: async (_, args, { user }) => {
      console.log(args);
      const { need } = args;

      const session = await db.startSession();

      console.log("starting transaction...");
      session.startTransaction();

      // Create need
      const [newNeed] = await Need.create(
        [
          {
            title: need.title,
            date: new Date(need.date),
            needType: need.needType,
            notes: need.notes,
            recipient: user.id,
            location: formatLocationInput(need.location)
          }
        ],
        { session }
      );

      // Check for needType and Details

      if (need.needType === "TRAVEL") {
        const [newNeedDetails] = await TravelNeed.create(
          [
            {
              ...need.travelNeedDetails,
              fromLocation: formatLocationInput(
                need.travelNeedDetails.fromLocation
              ),
              toLocation: formatLocationInput(
                need.travelNeedDetails.toLocation
              ),
              need: newNeed
            }
          ],
          { session }
        );

        // await assert.ok(newNeedDetails)
      } else if (need.needType === "CHILDCARE") {
        const errors = await Joi.validate(
          need.childcareNeedDetails,
          childcareNeedSchema,
          {
            abortEarly: false
          }
        );

        const [newNeedDetails] = await ChildcareNeed.create(
          [{ ...need.childcareNeedDetails, need: newNeed }],
          { session }
        );
      } else {
        // Abort transaction if no need details created.
        session.abortTransaction();
      }

      const request = await Request.create({
        need: newNeed,
        recipient: user
      });

      await session.commitTransaction();

      return request;
    },
    updateRequestStatus: async (_, args) => {
      const request = await Request.findById(args.id).exec();

      request.set({ status });

      await request.save();

      return request;
    },
    deleteRequest: async (_, { id }) => {
      const removedRequest = await Request.findOneAndRemove({ _id: id }).exec();

      if (!removedRequest) {
        throw new Error("Request not found");
      }

      return true;
    }
  }
};
