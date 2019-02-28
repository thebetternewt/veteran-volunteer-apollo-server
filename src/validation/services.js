import Joi from 'joi'

const ages = ['INFANT', 'TODDLER', 'CHILD', 'TEENAGER']

export const childcareServiceSchema = {
  age: Joi.array()
    .items(ages)
    .required()
    .min(1)
    .unique(),
}
