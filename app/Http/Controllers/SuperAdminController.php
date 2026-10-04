<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Clinic;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SuperAdminController extends Controller
{
    // Clinics

    public function indexClinics()
    {
        return Inertia::render('super_admin/clinics/index', [
            'clinics' => Clinic::all()
        ]);
    }

    public function createClinic()
    {
        return Inertia::render('super_admin/clinics/create');
    }

    public function storeClinic(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clinics,email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $clinic = Clinic::create($validated);

        User::create([
            'name' => $clinic->name . 'Admin',
            'email' => $clinic->email,
            'password' => bcrypt('password'),
            'role' => 'clinic_admin',
            'tenant_id' => $clinic->id,
            'is_active' => true,
        ]);

        return redirect()->route('admin.clinics.index')->with('success', 'Clinic and admin user created successfully.');
    }

    public function editClinic(Clinic $clinic) {
        return Inertia::render('super_admin/clinics/edit', [
            'clinic' => $clinic
        ]);
    }

    public function updateClinic(Request $request, Clinic $clinic) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clinics,email,' . $clinic->id,
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $clinic->update($validated);

        return redirect()->route('admin.clinics.index')->with('success', 'Clinic updated successfully.');
    }

    // Users

    public function indexUsers()
    {
        $users = User::with('clinic')
            ->orderBy('role')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_active' => (bool) $user->is_active,
                    'tenant_id' => $user->tenant->id ?? null,
                    'tenant' => $user->clinic ?
                        ['name' => $user->clinic->name]
                        : null,
                ];
            });

        return Inertia::render('super_admin/users/index', [
            'users' => $users
        ]);
    }

    public function toggleUserStatus(User $user)
    {
        $user->is_active = !$user->is_active;
        $user->save();

        return back();
    }
}




















