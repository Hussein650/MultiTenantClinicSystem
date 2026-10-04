<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class ClinicAdminController extends Controller
{
    public function indexDoctors()
    {
        $doctors = User::with('availabilities')
            ->where('role', 'doctor')
            ->where('is_active', true)
            ->get()
            ->map(function ($doctor) {
                $availabilities = $doctor->availabilities
                ->where('is_available', true)
                ->groupBy('day_of_week')
                ->map(function ($slots, $day) {
                    return [
                        'day' => (int) $day,
                        'slots' => $slots->map(fn($s) => [
                            'start' => substr($s->start_time, 0, 5),
                            'end' => substr($s->end_time, 0, 5),
                        ]),
                    ];
                })->values();

                return [
                    'id' => $doctor->id,
                    'name' => $doctor->name,
                    'email' => $doctor->email,
                    'spacialty' => $doctor->spacialty,
                    'availabilities' => $availabilities,
                    'has_availabilities' => $availabilities->isNotEmpty(),
                ];
            });
        
        return Inertia::render('clinic_admin/doctors/index', [
            'doctors' => $doctors,
        ]);
    }

    // Patients

    public function indexPatients()
    {
        return Inertia::render('clinic_admin/patients/index', [
            'patients' => User::where('role', 'patient')->get(),
        ]);
    }

    // Approvals

    public function indexApprovals()
    {
        return Inertia::render('clinic_admin/approvals', [
            'pendingDoctors' => User::where('role', 'doctor')->where('is_active', false)->get(),
        ]);
    }

    public function approveDoctor($id)
    {
        $user = User::where('id', $id)->where('role', 'doctor')->firstOrFail();

        $user->is_active = true;
        $user->save();

        return redirect()->back()->with('success', 'Doctor approved successfully.');
    }
}
 