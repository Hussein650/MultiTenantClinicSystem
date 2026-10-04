<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index ()
    {
        $user = auth()->user();

        $appointments = Appointment::with(['patient', 'doctor'])
            ->when($user->role === 'patient', function ($query) use ($user) {
                return $query->where('patient_id', $user->id);
            })
            ->when($user->role === 'doctor', function ($query) use ($user) {
                return $query->where('doctor_id', $user->id);
            })
            ->latest()
            ->get();

        return Inertia::render('appointments/index', [
            'appointments' => $appointments
        ]);
    }
}
