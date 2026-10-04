<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Clinic;
use App\Models\User;
use App\Models\Appointment;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if (!$user->is_active) {
            return Inertia::render('auth/inactive');
        }

        return match ($user->role) {
            'super_admin' => Inertia::render('super_admin/dashboard', [
                'totalClinics' => Clinic::count(),
                'totalUsers' => User::count(),
                'revenue' => 0,
            ]),
            'clinic_admin' => Inertia::render('clinic_admin/dashboard', [
                'totalDoctors' => $user->where('role', 'doctor')->where('tenant_id', $user->tenant_id)->count(),
                'totalPatients' => $user->where('role', 'patient')->where('tenant_id', $user->tenant_id)->count(),
                'pendingDoctors' => $user->where('role', 'doctor')->where('tenant_id', $user->tenant_id)->where('is_active', false)->count(),
            ]),
            'doctor' =>Inertia::render('doctor/dashboard', [
                'todayAppointments' => Appointment::where('doctor_id', $user->id)
                    ->whereDate('appointment_date', today())
                    ->where('status', Appointment::STATUS_CONFIRMED)
                    ->count(),
                'totalPatients' => Appointment::where('doctor_id', $user->id)
                    ->where('status', Appointment::STATUS_COMPLETED)
                    ->distinct('patient_id')
                    ->count(),
                'upcomingAppointments' => Appointment::where('doctor_id', $user->id)
                    ->where('appointment_date', '>=', today())
                    ->whereIn('status', [Appointment::STATUS_PENDING, Appointment::STATUS_CONFIRMED])
                    ->count(),
            ]),
            'patient' => Inertia::render('patient/dashboard', [
                'upcomingAppointments' => Appointment::where('patient_id', $user->id)
                    ->where('appointment_date', '>=', today())
                    ->whereIn('status', [Appointment::STATUS_PENDING, Appointment::STATUS_CONFIRMED])
                    ->count(),
                'totalVisits' => Appointment::where('patient_id', $user->id)
                    ->where('status', Appointment::STATUS_COMPLETED)
                    ->count(),
                'pendingAppointments' => Appointment::where('patient_id', $user->id)
                    ->where('status', Appointment::STATUS_PENDING)
                    ->count(),
            ]),
            default => Inertia::render('dashboard'),
        };
    }
}
