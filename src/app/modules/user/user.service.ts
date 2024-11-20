import QueryBuilder from '../../builder/QueryBuilder'
import { userSearchableField } from './user.constant'
import { User } from './user.model'

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields()

  const meta = await userQuery.countTotal()
  const result = await userQuery.modelQuery

  return {
    meta,
    result,
  }
}

// const deleteSlotFromDB = async (id: string) => {
//   const slot = await Slot.findById(id)

//   if (!slot) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Slot Not Found by this ID')
//   }

//   const result = await Slot.findByIdAndDelete(id)
//   return result
// }

export const UserServices = {
  getAllUserFromDB,
}
