<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctors_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('clinics')->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('users')->cascadeOndelete();
            $table->unsignedtinyInteger('day_of_week'); // 0 = Sunday, 1 = Monday ... 6 = Saturday
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->unique(['doctor_id', 'day_of_week', 'start_time', 'end_time'], 'dr_avail_unique');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors_availabilities');
    }
};
