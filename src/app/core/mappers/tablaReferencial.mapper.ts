import { TableReferencialRequestDto } from "src/app/infraestructure/dto/request/tablaReferencial.dto";
import { TablaReferencialModelRequest } from "../models/request/tablaReferencial.model";
import { TableReferencialResponseDto } from "src/app/infraestructure/dto/response/tablaReferencial.dto";
import { TablaReferencialModelResponse } from "../models/response/tablaReferencial.model";



export class TablaReferencialMapper {

  static fromDomainToApiTablaReferencial(dto: TablaReferencialModelRequest): TableReferencialRequestDto {
    return {
      tableId: dto.TableId,
      languageId: dto.LanguageId,
      codeId: dto.CodeId,
    }
  }

  static fromApiToDomainTablaReferencial(dto: TableReferencialResponseDto[]): TablaReferencialModelResponse[] {

    const data = dto.map((item:TableReferencialResponseDto) => {
      return {
        TableId: item.tableId,
        LanguageId: item.languageId,
        CodeId: item.codeId,
        TextCode: item.textCode,
        Description1: item.description1,
        Description2: item.description2,
        AuxiliaryData1: item.auxiliaryData1,
        AuxiliaryData2: item.auxiliaryData2,
        AuxiliaryData3: item.auxiliaryData3,
        Parameter: item.parameter,
        Active: item.active,
        DateRegister: item.dateRegister,
        DateUpdate: item.dateUpdate,
        PersonIdCreate: item.personIdCreate,
        PersonIdUpdate: item.personIdUpdate
      }
    })

    return data;
  }

}
