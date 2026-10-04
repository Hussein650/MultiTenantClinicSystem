<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory, BelongsToTenant;

    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'canclled';
    const STATUS_REJECTED = 'rejected';
    const STATUS_NO_SHOW = 'no_show';

    protected $fillable = [
        'tenant_id',
        'patient_id',
        'doctor_id',
        'appointment_data',
        'appointment_time',
        'status',
        'patient_notes',
        'doctor_notes',
        'completed_at',
        'cancelled_at'
    ];

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(User::class ,'doctor_id');
    }
}
