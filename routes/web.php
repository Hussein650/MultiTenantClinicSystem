<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\ClinicAdminController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Super Admin Routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Clinic CRUD
    Route::get('clinics', [SuperAdminController::class, 'indexClinics'])->name('clinics.index');
    Route::get('clinics/create', [SuperAdminController::class, 'createClinic'])->name('clinics.create');
    Route::post('clinics', [SuperAdminController::class, 'storeClinic'])->name('clinic.store');
    Route::get('clinics/{clinic}/edit', [SuperAdminController::class, 'editClinic'])->name('clinics.edit');
    Route::put('clinics/{clinic}', [SuperAdminController::class, 'updateClinic'])->name('updateClinic');
    // Users Management
    Route::get('users', [SuperAdminController::class, 'indexUsers'])->name('users.index');
    Route::patch('users/{user}/toggle', [SuperAdminController::class, 'toggleUserStatus'])->name('user.toggle');
});

// Clicnic Admin Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Doctors & Patients List
    Route::get('doctors', [ClinicAdminController::class, 'indexDoctors'])->name('doctors.index');
    Route::get('patients', [ClinicAdminController::class, 'indexPatients'])->name('patinets.index');
    // Approvals (under admin prefix)
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('approvals', [ClinicAdminController::class, 'indexApprovals'])->name('approvals.index');
        Route::post('approvals/{id}/approve', [ClinicAdminController::class, 'approveDoctor'])->name('approvals.approve');
    }); 
});

// Shared Routes Appointments
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('appointments', [AppointmentController::class, 'index'])->name('appointments.index');
});

// Doctor Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('appointments/{appointment}/confirm', [DoctorController::class, 'confirmAppointment'])->name('appointments.confirm');
    Route::post('appointments/{appointment}/complete', [DoctorController::class, 'completeAppointment'])->name('appointments.complete');

    // Weekily Availability
    Route::get('doctor/availability', [DoctorController::class, 'indexAvailability'])->name('doctor.availability.index');
    Route::post('doctor/availability', [DoctorController::class, 'updateAvailability'])->name('doctor.availability.update');
});

require __DIR__.'/settings.php';












