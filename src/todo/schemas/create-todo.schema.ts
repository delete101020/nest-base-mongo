import * as Joi from 'joi';

export const CreateTodoSchema = Joi.object().keys({
  title: Joi.string().trim().required(),
  description: [Joi.string().trim(), Joi.any().strip()],
  isPinned: Joi.boolean().default(false),
  isCompleted: Joi.boolean().default(false),
  isArchived: Joi.boolean().default(false),
  deadline: Joi.date().iso().default(new Date().toISOString()),
});
