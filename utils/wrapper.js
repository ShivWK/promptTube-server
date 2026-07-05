exports.asyncErrorHandler = (func) => async (req, res, next) => {
    try {
      await func(req, res, next)
    } catch (err) {
        console.log("Failed due to error", err);

        return res.status(500).json({
            status: "failed",
            message: err.message || "Something went wrong."
        })
    }
}

exports.requiredFieldsCheck = ({ args, fields }) => {
    args.forEach((param, index) => {
        if (!param) {
            const fieldName = fields?.[index] || "unknown Field";
            throw new Error(`Missing required field: ${fieldName}`)
        }
    })
}

exports.clearIfEmpty = async ({ Model, filter, field }) => {
    const doc = await Model.findOne(filter);

    if (doc && doc[field].length === 0) {
        await Model.deleteOne(filter);
        console.log(`Deleted empty ${Model.modelName} doc`)
    }
}