// Input Validation Utilities
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Generic validation middleware
export async function validateRequest<T>(
  req: NextRequest,
  schema: z.Schema<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate with Zod schema
    const data = schema.parse(body);
    
    return { success: true, data };
  } catch (error) {
    // Return validation error response
    return {
      success: false,
      error: new NextResponse(
        JSON.stringify({ error: 'Validation failed', details: error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    };
  }
}

// Common validation schemas
export const schemas = {
  // User schemas
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  
  // Driver schemas
  driver: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
    licenseNumber: z.string().min(5, 'License number must be at least 5 characters'),
    isActive: z.boolean().optional().default(true),
    nationalId: z.string().min(10, 'National ID must be at least 10 characters'),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    joiningDate: z.string().or(z.date()),
    notes: z.string().optional()
  }),
  
  // Vehicle schemas
  vehicle: z.object({
    plateNumber: z.string().min(3, 'Plate number must be at least 3 characters'),
    model: z.string().min(2, 'Model must be at least 2 characters'),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    color: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    technicalStatus: z.enum(['excellent', 'good', 'fair', 'poor']),
    registrationExpiryDate: z.string().or(z.date()),
    insuranceExpiryDate: z.string().or(z.date()),
    assignedDriverId: z.string().optional(),
    notes: z.string().optional()
  }),
  
  // Contract schemas
  contract: z.object({
    contractNumber: z.string().min(3, 'Contract number must be at least 3 characters'),
    clientName: z.string().min(2, 'Client name must be at least 2 characters'),
    clientPhone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
    contractType: z.enum(['rental', 'ownership', 'monthly', 'other']),
    vehicleId: z.string(),
    driverId: z.string().optional(),
    amount: z.number().positive('Amount must be positive'),
    status: z.enum(['active', 'completed', 'cancelled']),
    notes: z.string().optional()
  }),
  
  // Payment schemas
  payment: z.object({
    amount: z.number().positive('Amount must be positive'),
    paymentDate: z.string().or(z.date()),
    dueDate: z.string().or(z.date()).optional(),
    paymentMethod: z.enum(['cash', 'bank_transfer', 'credit_card', 'other']),
    status: z.enum(['paid', 'due', 'overdue']),
    contractId: z.string().optional(),
    driverId: z.string().optional(),
    vehicleId: z.string().optional(),
    description: z.string().optional(),
    receiptNumber: z.string().optional()
  })
};
