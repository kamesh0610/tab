'use client'

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { AlignCenter, Edit2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';


interface Medicine{
  name: string;
  dosage: string;
}

interface Medication {
  id: number
  medicine: string
  routine: string[]
  foodTiming: string
  days: number
}

export default function TabDispenser() {
  const [patientName, setPatientName] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [currentMedicine, setCurrentMedicine] = useState('')
  const [currentRoutine, setCurrentRoutine] = useState<string[]>([])
  const [currentFoodTiming, setCurrentFoodTiming] = useState('')
  const [currentDays, setCurrentDays] = useState(0)
  const [editingId, setEditingId] = useState<number | null>(null)
  const { toast } = useToast()
  const [code, setCode] = useState(null);
  


  const getTablets = async () =>{
    const tablets = await axios.get('http://localhost:5000/api/tablets') // API to fetch tablet options
      .then(response => {
        setMedicines(response.data);
      })
      .catch(error => {
        console.error('Error fetching tablet data:', error);
      });
  }
  useEffect(()=>{
    getTablets();
  },[])
  const handleRoutineToggle = (value: string) => {
    if (!value) return
    setCurrentRoutine(prev => {
      const current = prev || []
      return current.includes(value)
        ? current.filter(r => r !== value)
        : [...current, value]
    })
  }

  const resetForm = () => {
    setCurrentMedicine('')
    setCurrentRoutine([])
    setCurrentFoodTiming('')
    setCurrentDays(0)
    setEditingId(null)
  }

  const handleAddMedication = () => {
    if (!currentMedicine) {
      toast({ description: "Please select a medicine", variant: "destructive" })
      return
    }
    if (currentRoutine.length === 0) {
      toast({ description: "Please select at least one routine time", variant: "destructive" })
      return
    }
    if (!currentFoodTiming) {
      toast({ description: "Please select food timing", variant: "destructive" })
      return
    }
    if (!currentDays) {
      toast({ description: "Please enter number of days", variant: "destructive" })
      return
    }

    if (editingId !== null) {
      setMedications(medications.map(med =>
        med.id === editingId
          ? {
              id: med.id,
              medicine: currentMedicine,
              routine: currentRoutine || [],
              foodTiming: currentFoodTiming,
              days: currentDays
            }
          : med
      ))
      toast({ description: "Medication updated successfully" })
    } else {
      const newId = medications.length > 0 ? Math.max(...medications.map(m => m.id)) + 1 : 1
      setMedications([...medications, {
        id: newId,
        medicine: currentMedicine,
        routine: currentRoutine || [],
        foodTiming: currentFoodTiming,
        days: currentDays
      }])
      toast({ description: "Medication added successfully" })
    }

    resetForm()
  }

  const handleEdit = (medication: Medication) => {
    setCurrentMedicine(medication.medicine)
    setCurrentRoutine(medication.routine || [])
    setCurrentFoodTiming(medication.foodTiming)
    setCurrentDays(medication.days)
    setEditingId(medication.id)
  }

  const handleDelete = (id: number) => {
    setMedications(medications.filter(med => med.id !== id))
  }

  const handleSubmit = async () => {
    if (!patientName || !patientAge || !patientPhone || medications.length === 0) {
      toast({ description: "Please complete all required fields", variant: "destructive" });
      return;
    }
    const routineMap: { [key: string]: string } = {
      Morning: "M",
      Afternoon: "A",
      Night: "N",
    };
    const payload = {
      patientName,
      patientAge: parseInt(patientAge),
      phoneNumber: patientPhone,
      medicines: medications.map(med => ({
        name: med.medicine,
        routine: med.routine.map(r => routineMap[r]).join("/"),
        timing: med.foodTiming,
        noOfTablets: med.days * med.routine.length,
      
      })),
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/prescriptions', payload);
      console.log("res",response.data)
      toast({ description: response.data.message });
      const prescription = response.data;
      const generatePDF = (data: any) => {
        console.log("data",data)
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        const date = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text(`Date: ${date}`, 180, 40, { align: "right" });
    doc.setFontSize(16);
    
    doc.text('Patient Prescription ',110,20, { align: "center" });
    // doc.text("Prescription QR Code", 20, 20);
    const codeId = prescription.prescription.codeId;
    console.log(codeId);
    // Add patient details
    doc.setFontSize(12);
    doc.text(`Patient Name: ${patientName}`, 20, 60);
    doc.text(`Patient Age: ${patientAge}`, 90, 60);
    doc.text(`Phone Number: ${patientPhone}`, 140, 60);
    doc.text(`Code ID: ${codeId}`, 20, 40);
    const tableBody = data.prescription.medicines.map((med: any, index: number) => [
      index + 1,
      med.name,
      med.routine,
      med.timing,
      med.noOfTablets,
    ]);
    autoTable(doc,{
      head: [["Index", "Medicine Name","Routine", "Timing", "No. of Tablets"]],
      body: tableBody,
      startY: 80, // Start position for the table
      theme: "grid",
    });

    const qrCodeUrl = prescription.qrCode; // Base64 QR code
    doc.addImage(qrCodeUrl, 'PNG', 20, 200, 50, 50);
    // Add QR Code to PDF
    // doc.addImage(qrCodeUrl, 'PNG', 20, 70, 150, 150);

    // Trigger PDF download
    doc.save(`Prescription_${patientName}.pdf`);
//     const pdfBlob = doc.output('blob');
// const pdfUrl = URL.createObjectURL(pdfBlob);
// window.open(pdfUrl, '_blank');

  };
  generatePDF(prescription);
    } catch (error) {
      toast({ description: "Failed to save prescription", variant: "destructive" });
      console.error('Error submitting prescription:', error);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold">Tab Dispenser</h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Patient Name</Label>
              <Input 
                id="name" 
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number"
                min={0}
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="Enter age" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel"
                min={0}
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="Enter phone number" 
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Add Prescription</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Medicine Name</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {currentMedicine || "Select medicine"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" side="bottom" align="start">
                    <Command>
                      <CommandList>
                      <CommandInput placeholder="Search medicine..." />
                      <CommandEmpty>No medicine found.</CommandEmpty>
                      <CommandGroup>
                        {medicines.map((medicine) => (
                          <CommandItem
                            key={medicine.name}
                            onSelect={() => setCurrentMedicine(`${medicine.name} - ${medicine.dosage}`)}

                          >
                            {medicine.name} - {medicine.dosage}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Routine</Label>
                <div className="flex gap-2">
                  {['Morning', 'Afternoon', 'Night'].map((time) => (
                    <Button
                      key={time}
                      variant={currentRoutine?.includes(time) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRoutineToggle(time)}
                      className="flex-1"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Food Timing</Label>
                <Select
                  value={currentFoodTiming}
                  onValueChange={setCurrentFoodTiming}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Before Food</SelectItem>
                    <SelectItem value="after">After Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Days</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Number of days"
                    value={currentDays}
                    min={0}
                    onChange={(e) => setCurrentDays(e.target.value == "" ? 0 : parseInt(e.target.value))}
                  />
                  <Button onClick={handleAddMedication}>
                    {editingId !== null ? 'Update' : 'Add'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {medications.length > 0 && (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Routine</TableHead>
                    <TableHead>Food Timing</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">{medication.medicine}</TableCell>
                      <TableCell>{(medication.routine || []).join(', ')}</TableCell>
                      <TableCell>{medication.foodTiming === 'before' ? 'Before Food' : 'After Food'}</TableCell>
                      <TableCell>{medication.days}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(medication)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(medication.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {medications.length > 0 && (
            <div className="flex justify-end">
              <Button size="lg" onClick={handleSubmit}>
                Save Prescription
              </Button>
            </div>
          )}
        </div>
      </div>
      <Toaster/>
    </div>
  )
}