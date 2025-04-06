import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  learningPreferences: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    learningStyle: string;
    interests: string[];
  };
  progress: {
    completedLessons: string[];
    achievements: string[];
    points: number;
    level: number;
    streak: number;
    lastActive: Date;
  };
  settings: {
    theme: string;
    notifications: boolean;
    preferredProvider?: string;
    accessibility: {
      highContrast: boolean;
      textToSpeech: boolean;
      fontSize: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  learningPreferences: {
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    learningStyle: String,
    interests: [String]
  },
  progress: {
    completedLessons: [String],
    achievements: [String],
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    streak: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  settings: {
    theme: {
      type: String,
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    preferredProvider: {
      type: String,
      default: 'gpt-4'
    },
    accessibility: {
      highContrast: {
        type: Boolean,
        default: false
      },
      textToSpeech: {
        type: Boolean,
        default: false
      },
      fontSize: {
        type: Number,
        default: 16
      }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model<IUser>('User', userSchema);
export default User; 