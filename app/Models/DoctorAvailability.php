<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class DoctorAvailability extends Model
{
    use HasFactory, BelongsToTenant;

    protected $table = 'doctors_availabilities';
    
    protected $fillable = [
        'tenant_id',
        'doctor_id',
        'day_of_week',
        'start_time',
        'end_time',
        'is_available',
    ];

    protected function casts(): array {
        return [
            'is_available' => 'boolean',
            'day_of_week' => 'integer',
        ];
    }

    public function doctor() {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
