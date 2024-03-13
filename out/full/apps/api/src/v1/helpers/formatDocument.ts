import { JourneyDocument, ResponseWithPagination } from '@repo/shared';
import { DeliverOrderDocument } from '@repo/shared/dist/packages/shared/src/interfaces/delivery-order';

function showCreatorInfo(
  data: JourneyDocument | DeliverOrderDocument,
  user_id = ''
) {
  // if the user is signed in and in the list of companions
  if (
    user_id &&
    data.companions.findIndex(
      (c) => c._id.toString() === user_id.toString()
    ) !== -1 &&
    !data.be_in_touch
  ) {
    return data.created_by;
  }

  return {
    _id: data.created_by?._id,
  };
}

export const hideUserInfoDependOnFieldBeOnTouch = (
  data: JourneyDocument | DeliverOrderDocument,
  user_id = ''
) => {
  return {
    ...data,
    created_by: showCreatorInfo(data, user_id),
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
