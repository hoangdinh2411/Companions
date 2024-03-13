import {
  DeliveryOrderDocument,
  JourneyDocument,
  UserDocument,
} from '@repo/shared';

function showCreatorInfo(
  data: JourneyDocument | DeliveryOrderDocument,
  user_id = ''
) {
  // if the user is signed in and in the list of companions
  if (
    user_id &&
    data.companions.findIndex(
      (c: UserDocument) => c._id.toString() === user_id.toString()
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
  data: JourneyDocument | DeliveryOrderDocument,
  user_id = ''
) => {
  return {
    ...data,
    created_by: showCreatorInfo(data, user_id),
    companions:
      data.companions.length > 0
        ? data.companions.map((companion: UserDocument) => {
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
