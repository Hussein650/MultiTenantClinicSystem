<?php

namespace App\Traits;

use App\Models\Clinic;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait BelongsToTenant 
{
    protected static function bootBelongsToTenant()
    {
        static::creating(function (Model $model) {
            if (auth()->check() && !$model->tenant_id) {
                $model->tenant_id = auth()->user()->tenant_id;
            }
        });

        static::addGlobalScope('tenant', function (Builder $builder) {
            if (auth()->hasUser()) {
                $user = auth()->user();
                if($user && $user->role !== 'super_admin') {
                    $builder->where($builder->getModel()->getTable() . '.tenant_id', $user->tenant_id);
                }
            }
        });
    }

    public function clinic()
    {
        return $this->belongsTo(Clinic::class, 'tenant_id');
    }
}