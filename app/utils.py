from datetime import datetime


def api_to_date(date_string):
    """
    Função para converter data do formato fornecido pela API
    'YYYY-mm-ddTHH:MM:SSZ' para objeto datetime do python.

    :param date_string: String fornecida pela api
    :returns: datetime
    """
    try:
        return datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S.%f')
    except:
        try:
            return datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S')
        except:
            return datetime.strptime(date_string, '%Y-%m-%d')
