<?php

namespace App\Http\Controllers;

use App\Models\CLasses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request) {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'class_name' => 'required|string|min:3'
        ]);

        if ($validation->fails()) {
            return $this->response(400, 'failed', [], $validation->errors());
        }

        $classes = CLasses::create([
            'class_name' => $request->class_name
        ]);
        return $this->response(200, 'success', 'success created class', [
            'data' => $classes
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $class = CLasses::findOrFail($id);
        return $this->response(200, 'success', 'success show in class', [
            'data' => $class
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CLasses $cLasses)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $class = CLasses::findOrFail($id);
        $class->update([
            'class_name' => $request->class_name
        ]);
        return $this->response(200, 'success', 'success updated in class', [
            'data' => $class
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $class = CLasses::findOrFail($id);
        $class->delete();
        return $this->response(200, 'success', 'success delete in class', [
            'data' => $class
        ]);
    }
}
