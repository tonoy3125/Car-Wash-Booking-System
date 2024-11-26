import { FilterQuery, Query } from 'mongoose'

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      })
    }

    return this
  }

  filter() {
    const queryObj = { ...this.query } // copy

    // Filtering
    const excludeFields = [
      'searchTerm',
      'sort',
      'limit',
      'page',
      'fields',
      'minPrice',
      'maxPrice',
      'startTime',
      'endTime',
    ]

    excludeFields.forEach((el) => delete queryObj[el])

    // Handle specific filters like date and serviceId
    if (queryObj.date) {
      queryObj.date = new Date(queryObj.date as string) // Convert to Date object
    }

    if (queryObj.serviceId) {
      queryObj.service = queryObj.serviceId // Map serviceId to service
      delete queryObj.serviceId // Remove redundant serviceId field
    }

    // Handle price range
    if (this.query.minPrice || this.query.maxPrice) {
      const priceRange: Record<string, number> = {}
      if (this.query.minPrice) priceRange['$gte'] = Number(this.query.minPrice)
      if (this.query.maxPrice) priceRange['$lte'] = Number(this.query.maxPrice)

      queryObj.price = priceRange
    }

    // Handle time range filtering
    if (this.query.startTime || this.query.endTime) {
      const timeRange: Record<string, string> = {}
      if (this.query.startTime) timeRange['$gte'] = this.query.startTime
      if (this.query.endTime) timeRange['$lte'] = this.query.endTime

      queryObj.startTime = timeRange // Ensure `startTime` is part of your model fields
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>)

    return this
  }

  sort() {
    const sortParam = this.query.sort as string

    if (sortParam === 'price_low_to_high') {
      this.modelQuery = this.modelQuery.sort('price') // Ascending order by price
    } else if (sortParam === 'price_high_to_low') {
      this.modelQuery = this.modelQuery.sort('-price') // Descending order by price
    } else {
      // Default sorting by createdAt (most recent first)
      const sort = sortParam?.split(',')?.join(' ') || '-createdAt'
      this.modelQuery = this.modelQuery.sort(sort)
    }

    return this
  }

  paginate() {
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 9
    const skip = (page - 1) * limit

    this.modelQuery = this.modelQuery.skip(skip).limit(limit)

    return this
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v'

    this.modelQuery = this.modelQuery.select(fields)
    return this
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter()
    const total = await this.modelQuery.model.countDocuments(totalQueries)
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 9
    const totalPage = Math.ceil(total / limit)

    return {
      page,
      limit,
      total,
      totalPage,
    }
  }
}

export default QueryBuilder
