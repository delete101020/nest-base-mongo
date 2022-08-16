import * as Joi from 'joi';

export const UpdateTodoSchema = Joi.object().keys({
  title: [Joi.string().trim(), Joi.any().strip()],
  description: [Joi.string().trim(), Joi.any().strip()],
  isPinned: Joi.boolean().default(false),
  isCompleted: Joi.boolean().default(false),
  isArchived: Joi.boolean().default(false),
  deadline: [Joi.date().iso(), Joi.any().strip()],
});
