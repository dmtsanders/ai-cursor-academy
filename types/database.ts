export interface User {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role: 'student' | 'admin';
}

export interface Class {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  price: number;
  duration_hours: number;
  instructor_name: string;
  instructor_bio: string | null;
  max_students: number | null;
  meeting_link: string;
  meeting_type: 'teams' | 'zoom' | 'google-meet';
  schedule: ClassSchedule[];
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassSchedule {
  id: string;
  class_id: string;
  start_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  is_full: boolean;
  enrolled_count: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  class_id: string;
  schedule_id: string;
  payment_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  user?: User;
  class?: Class;
  schedule?: ClassSchedule;
  payment?: Payment;
}

export interface Payment {
  id: string;
  user_id: string;
  class_id: string;
  amount: number;
  currency: string;
  payment_method: 'stripe' | 'paypal';
  payment_intent_id: string | null;
  paypal_order_id: string | null;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  created_at: string;
}

