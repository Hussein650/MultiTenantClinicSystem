<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Clinic;
use App\Models\Appointment;
use App\Models\DoctorAvailability;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //
        // 1- Super admin
        //
        User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        //
        // 2- Clinic A City Hospital
        //

        $clinicA = Clinic::create([
            'name' => 'عيادة الشفاء',
            'email' => 'shefa@example.com',
            'phone' => '0112304780',
            'address' => '123 Main St, Cityville',
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'clinic_admin',
            'tenant_id' => $clinicA->id,
            'is_active' => true,
        ]);

        $doctorA = User::create([
            'name' => 'Saeed Mohmmad',
            'email' => 'saeed@example.com',
            'password' => Hash::make('password'),
            'role' => 'doctor',
            'tenant_id' => $clinicA->id,
            'specialty' => 'Cardiology',
            'is_active' => true,
        ]);

        $patientA = User::create([
            'name' => 'mazin othman',
            'email' => 'mazin@example.com',
            'password' => Hash::make('password'),
            'role' => 'patient',
            'tenant_id' => $clinicA->id,
            'age' => 30,
            'gender' => 'male',
            'is_active' => true,
        ]);

        //
        // 3- Clinic B Ibn Al nfees
        //

        $clinicB = Clinic::create([
            'name' => 'عيادة إبن النفيس',
            'email' => 'ibnalnfeis@example.com',
            'phone' => '0111222111',
            'address' => '456 Elm St, Cityville',
        ]);

        User::create([
            'name' => 'Omar Said',
            'email' => 'omar@example.com',
            'password' => Hash::make('password'),
            'role' => 'clinic_admin',
            'tenant_id' => $clinicB->id,
            'is_active' => true,
        ]);

        $doctorB = User::create([
            'name' => 'Waleed Hassan',
            'email' => 'waleed@example.com',
            'password' => Hash::make('password'),
            'role' => 'doctor',
            'tenant_id' => $clinicB->id,
            'specialty' => 'Cardiology',
            'is_active' => true,
        ]);

        $patientB = User::create([
            'name' => 'Razan Ahmed',
            'email' => 'razan@example.com',
            'password' => Hash::make('password'),
            'role' => 'patient',
            'tenant_id' => $clinicB->id,
            'age' => 30,
            'gender' => 'female',
            'is_active' => true,
        ]);

        //
        // 4- Doctor Weekly Availabilities
        //

        $timeSlots = [
            ['start' => '09:00', 'end' => '12:00'],
            ['start' => '13:00', 'end' => '17:00'],
        ];

        foreach ([$doctorA, $doctorB] as $doctor) {
            for ($day = 1; $day <= 5; $day++) {
                foreach ($timeSlots as $slot) {
                    DoctorAvailability::create([
                        'tenant_id' => $doctor->tenant_id,
                        'doctor_id' => $doctor->id,
                        'day_of_week' => $day,
                        'start_time' => $slot['start'],
                        'end_time' => $slot['end'],
                        'is_available' => true,
                    ]);
                }
            }
        }

        //
        // 5- Simple Appointments
        //

        $appointmentsData = [
            ['clinic' => $clinicA, 'doctor' => $doctorA, 'patient' => $patientA],
            ['clinic' => $clinicB, 'doctor' => $doctorB, 'patient' => $patientB],
        ];

        foreach ($appointmentsData as $data) {
            $date = Carbon::today()->addDays(rand(1, 14));
            $time = Carbon::createFromTime(rand(9, 16), 0)->format('H:i');

            Appointment::create([
                'tenant_id' => $data['clinic']->id,
                'patient_id' => $data['patient']->id,
                'doctor_id' => $data['doctor']->id,
                'appointment_date' => $date->format('Y-m-d'),
                'appointment_time' => $time,
                'status' => Appointment::STATUS_CONFIRMED,
                'patient_notes' => 'Regular check up appointment',
            ]);

            $pastDate = Carbon::today()->subDays(rand(5, 30));
            $pastTime = Carbon::createFromTime(rand(9, 16), 0)->format('H:i');

            Appointment::create([
                'tenant_id' => $data['clinic']->id,
                'patient_id' => $data['patient']->id,
                'doctor_id' => $data['doctor']->id,
                'appointment_date' => $pastDate->format('Y-m-d'),
                'appointment_time' => $pastTime,
                'status' => Appointment::STATUS_COMPLETED,
                'patient_notes' => 'Follow up consultation',
                'doctor_notes' => 'Patient is recovering well. Schedule next vist in 3 months.',
                'completed_at' => $pastDate->addHour(),
            ]);

        }
    }
}
