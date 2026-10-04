<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\DoctorAvailability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DoctorController extends Controller
{
    public function confirmAppointment($id) {
        $doctorId = auth()->id();
        
        $appointment = Appointment::where('id', $id)
            ->where('doctor_id', $doctorId)
            ->where('status', Appointment::STATUS_PENDING)
            ->first();

        if (!$appointment) {
            return back()->with('error', 'الموعد غير موجود أو ليس في حالة قيد الانتظار');
        }

        $appointment->update([
            'status' => Appointment::STATUS_CONFIRMED,
        ]);

        return back()->with('success', 'تم تأكيد الموعد بنجاح');
    }

    public function completeAppointment(Request $request, $id)
    {
        try {
            $doctorId = auth()->id();

            if (!$doctorId) {
                return redirect()->route('login')->with('error', 'الرجاء تسجيل الدخول أولاً');
            }

            $request->validate([
                'doctor_notes' => 'required|string|min:10'
            ]);

            $appointment = Appointment::where('id', $id)
                ->where('doctor_id', $doctorId)
                ->where('status', Appointment::STATUS_CONFIRMED)
                ->first();

            if (!$appointment) {
                return back()->with('error', 'الموعد غير موجود أو تم إكماله مسبقاً');
            }

            $appointment->update([
                'status' => Appointment::STATUS_COMPLETED,
                'doctor_notes' => $request->doctor_notes,
                'completed_at' => now(),
            ]);

            return back()->with('success', 'تم إكمال الموعد بنجاح');
        } catch (\Exception $e) {
            Log::error('فشل إكمال الموعد', [
                'message' => $e->getMessage(),
            ]);

            return back()->with('error', 'حدث خطأ أثناء إكمال الموعد');
        }
    }

    // Weekly Availability
    public function indexAvailability()
    {
        $doctorId = auth()->id();

        $availabilities = DoctorAvailability::where('doctor_id', $doctorId)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('doctor/availability', [
            'availabilities' => $availabilities,
        ]);
    }

    public function updateAvailability(Request $request)
    {
        $doctorId = auth()->id();

        $validated = $request->validate([
            'slots' => 'required|array',
            'slots.*.day_of_week' => 'required|integer|between:0,6',
            'slots.*.start_time' => 'required|date_format:H:i',
            'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time',
        ]);

        // Delete all existing slots, then recreate from submittied data
        // This preserves the exact state the doctor configured (including inactive slots)
        DoctorAvailability::where('doctor_id', $doctorId)->delete();

        foreach ($validated['slots'] as $slot) {
            DoctorAvailability::create([
                'doctor_id' => $doctorId,
                'day_of_week' => $slot['day_of_week'],
                'start_time' => $slot['start_time'],
                'end_time' => $slot['end_time'],
                'is_available' => (bool) ($slot['is_available'] ?? true),
            ]);
        }

        return redirect()->route('doctor.availability.index')
            ->with('success', 'تم تحديث أوقات التوفر بنجاح');
    }

}
