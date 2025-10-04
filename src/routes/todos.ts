import express, { Request, Response } from 'express';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../models/Todo';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/todos - Fetch all todos
router.get('/', async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/todos/:id - Fetch a single todo by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
      return;
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description }: CreateTodoInput = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Title is required'
      });
      return;
    }

    const newTodo = new Todo({
      title: title.trim(),
      description: description?.trim() || undefined
    });

    const savedTodo = await newTodo.save();

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: savedTodo
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/todos/:id - Update an existing todo
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, completed }: UpdateTodoInput = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
      return;
    }

    // Build update object with only provided fields
    const updateData: Partial<UpdateTodoInput> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || undefined;
    if (completed !== undefined) updateData.completed = completed;

    // Validate that at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one field (title, description, or completed) must be provided for update'
      });
      return;
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/todos/:id - Delete a todo by ID
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid todo ID format'
      });
      return;
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: deletedTodo
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
