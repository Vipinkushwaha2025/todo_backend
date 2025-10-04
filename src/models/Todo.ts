import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for Todo document
export interface ITodo extends Document {
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for Todo 
const TodoSchema: Schema<ITodo> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Todo model
export const Todo = mongoose.model<ITodo>('Todo', TodoSchema);

// Type for creating a new todo (without auto-generated fields)
export interface CreateTodoInput {
  title: string;
  description?: string;
}

// Type for updating a todo
export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
}
