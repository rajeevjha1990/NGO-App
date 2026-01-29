import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { AlertController, ToastController } from "@ionic/angular"; // Toast add kiya feedback ke liye
import { HeaderComponent } from "src/app/components/header/header.component";
import { UserService } from "src/app/services/user/user.service";
import { SHARED_IONIC_MODULES } from "src/app/shared/shared.ionic";
import { FormsModule } from "@angular/forms"; // Model reset ke liye zaroori hai

@Component({
  selector: "app-assigned-orders",
  templateUrl: "./assigned-orders.page.html",
  styleUrls: ["./assigned-orders.page.scss"],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent, FormsModule],
})
export class AssignedOrdersPage implements OnInit {
  assignedorders: any = [];
  associatesList: any = [];

  constructor(
    private userServ: UserService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef // Feedback ke liye
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    this.loadData();
  }

  async loadData() {
    this.assignedorders = [];
    const res = await this.userServ.assigneOrders();
    this.assignedorders = res;
    this.associatesList = await this.userServ.myareaAssociates();
    this.cdr.detectChanges();
  }

  async assignToAssociate(order: any, event: any) {
    const associateId = event.detail.value;
    if (!associateId) return;

    const alert = await this.alertCtrl.create({
      header: "Confirm Assignment!",
      message: `Are you sure you want to assign Order ID: #ORD-${order.order_id} to this associate?`,
      buttons: [
        {
          text: "NO",
          role: "cancel",
          handler: () => {
            order.selectedAssociate = null; // Dropdown reset
          },
        },
        {
          text: "Yes",
          handler: () => {
            const payload = {
              order_id: order.order_id,
              associate_id: associateId,
            };
            this.processAssignment(payload);
          },
        },
      ],
    });
    await alert.present();
  }

  async processAssignment(payload: any) {
    try {
      const resp: any = await this.userServ.orderAssignedChoosesAssociate(
        payload
      );

      if (resp && resp.status) {
        // 1. Toast dikhayein
        const toast = await this.toastCtrl.create({
          message: resp.msg || "Order assigned successfully!",
          duration: 2000,
          color: "success",
        });
        await toast.present();

        // 2. Data refresh karein
        await this.loadData();
      } else {
        alert(resp.msg || "Assignment failed");
      }
    } catch (error) {
      console.error("Error assigning order:", error);
    }
  }
}
