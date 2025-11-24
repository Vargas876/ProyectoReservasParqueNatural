package com.uptc.bases2.demo.exceptions;

/**
 * Excepción para violaciones de reglas de negocio (422)
 * Ej: Cupo excedido, máximo de reservas alcanzado, etc.
 */
public class BusinessRuleException extends RuntimeException {

    private String ruleCode;

    public BusinessRuleException(String message) {
        super(message);
    }

    public BusinessRuleException(String message, String ruleCode) {
        super(message);
        this.ruleCode = ruleCode;
    }

    public BusinessRuleException(String message, Throwable cause) {
        super(message, cause);
    }

    public String getRuleCode() {
        return ruleCode;
    }

    public void setRuleCode(String ruleCode) {
        this.ruleCode = ruleCode;
    }
}
