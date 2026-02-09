<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateViewVwShipmentReport extends Migration
{
    public function up()
    {
        DB::statement("
            CREATE VIEW vw_shipment_report AS
            SELECT
                sd.id AS id,
                s.id AS shipment_id,
                sd.category AS Category,
                sd.item_code AS ItemCode,
                sd.item_name AS ItemName,
                sd.created_at AS DateIssued,
                s.created_at AS DateCreated,
                sd.order_no AS OrderNo,
                s.sold_to AS SoldTo,
                (
                    SELECT shipment_sold_to_lists.division
                    FROM shipment_sold_to_lists
                    WHERE shipment_sold_to_lists.sold_to = s.sold_to
                    LIMIT 1
                ) AS Division,
                s.ctrl_no AS ControlNumber,
                (
                    SELECT CONCAT(db_pps_preshipments.Destination, '-', db_pps_preshipments.Packing_List_CtrlNo)
                    FROM db_pps_preshipments
                    WHERE db_pps_preshipments.id = s.preshipment_id
                    AND db_pps_preshipments.logdel = 0
                    LIMIT 1
                ) AS PreshipCtrlNo,
                sd.product_po_no AS ProductPONo,
                sd.shipout_qty AS ShipoutQty,
                sd.unit_price AS UnitPrice,
                sd.amount AS Amount,
                sd.lot_no AS LotNo,
                sd.remarks AS Remarks,
                sd.updated_at AS LastUpdate
            FROM shipments s
            JOIN shipment_details sd
                ON sd.shipment_id = s.id
            WHERE
                s.logdel = 0
                AND sd.logdel = 0
        ");
    }

    public function down()
    {
        DB::statement("DROP VIEW IF EXISTS vw_shipment_report");
    }
}
