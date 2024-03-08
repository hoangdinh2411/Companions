import { JourneyDocument, ResponseWithPagination } from '@repo/shared';
import { DeliverOrderDocument } from '@repo/shared/dist/packages/shared/src/interfaces/delivery-order';

export const hideUserInfoDependOnFieldBeOnTouch = (
  data: JourneyDocument | DeliverOrderDocument,
  user_id = ''
) => {
  return {
    ...data,
    created_by:
      //+ is signed in
      //+ to be in touch is false
      //+ is in the companions list
      user_id &&
      !data.be_in_touch &&
      data.companions.findIndex(
        (c) => c._id.toString() === user_id.toString()
      ) > -1
        ? data.created_by
        : {
            _id: data.created_by?._id,
          },
    companions:
      data.companions.length > 0
        ? data.companions.map((companion) => {
            //+is signed in
            //+is the creator

            // only creator can see the full list of companions
            if (
              user_id &&
              data.created_by?._id.toString() === user_id.toString()
            ) {
              return companion;
            }

            // otherwise
            return {
              _id: companion?._id,
            };
          })
        : data.companions,
  };
};
