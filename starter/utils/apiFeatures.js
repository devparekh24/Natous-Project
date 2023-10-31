class APIFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }

    filter() {

        //simple filtering

        const queryObj = { ...this.queryStr }
        const excludedField = ['page', 'limit', 'sort', 'fields']
        excludedField.forEach(el => delete queryObj[el])
        // let query = Tour.find(queryObj)

        //adv filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // console.log(queryStr,queryObj)
        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sort() {
        // //sorting
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }
        else {
            this.query = this.query.sort('-createdAt')
        }
        // console.log(query.sort(req.query.sort))

        //other type
        // const query = await Tour.find(queryObj).sort({ price: 1 })
        // console.log(query)
        return this
    }

    limitfields() {
        //field limiting
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields)
        }
        else {
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        //pagination
        const page = this.queryStr.page * 1 || 1
        const limit = this.queryStr.limit * 1
        const skip = (page - 1) * limit
        // console.log(page, limit, skip)

        this.query = this.query.skip(skip).limit(limit)
        // if (this.queryStr.page) {
        //     const count = await Tour.countDocuments()
        //     if (skip >= count) {
        //         throw new Error('This page doesn\'t exists!')
        //     }
        // }
        return this;
    }
}

module.exports = APIFeatures;